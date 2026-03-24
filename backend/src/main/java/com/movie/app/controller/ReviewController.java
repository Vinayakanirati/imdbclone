package com.movie.app.controller;

import com.movie.app.model.Movie;
import com.movie.app.model.Review;
import com.movie.app.model.User;
import com.movie.app.repository.MovieRepository;
import com.movie.app.repository.ReviewRepository;
import com.movie.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Review>> getReviewsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewRepository.findByMovieId(movieId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> payload) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Long movieId = Long.valueOf(payload.get("movieId").toString());
        Integer rating = Integer.valueOf(payload.get("rating").toString());
        String content = payload.get("content").toString();

        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (!movieOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Movie not found");
        }

        Review review = new Review();
        review.setUser(user);
        review.setMovie(movieOpt.get());
        review.setRating(rating);
        review.setContent(content);

        return ResponseEntity.status(HttpStatus.CREATED).body(reviewRepository.save(review));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (!reviewOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Review review = reviewOpt.get();
        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own reviews");
        }

        if (payload.containsKey("rating")) {
            review.setRating(Integer.valueOf(payload.get("rating").toString()));
        }
        if (payload.containsKey("content")) {
            review.setContent(payload.get("content").toString());
        }

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (!reviewOpt.isPresent()) return ResponseEntity.notFound().build();

        Review review = reviewOpt.get();
        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own reviews, unless you are ADMIN.");
        }

        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Review deleted");
    }
}
