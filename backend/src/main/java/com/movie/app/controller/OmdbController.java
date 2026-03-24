package com.movie.app.controller;

import com.movie.app.service.OmdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/omdb")
public class OmdbController {

    @Autowired
    private OmdbService omdbService;

    @GetMapping("/search")
    public ResponseEntity<String> searchMovies(
            @RequestParam(name="s", required = false) String s,
            @RequestParam(name="type", required = false) String type,
            @RequestParam(name="y", required = false) String y,
            @RequestParam(name="r", required = false) String r,
            @RequestParam(name="page", required = false) Integer page) {
        
        if (s == null || s.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"Error\":\"Parameter 's' is required for search.\"}");
        }
        
        String result = omdbService.searchMovies(s, type, y, r, page);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/movie")
    public ResponseEntity<String> getMovie(
            @RequestParam(name="i", required = false) String i,
            @RequestParam(name="t", required = false) String t,
            @RequestParam(name="type", required = false) String type,
            @RequestParam(name="y", required = false) String y,
            @RequestParam(name="plot", required = false) String plot,
            @RequestParam(name="r", required = false) String r) {
        
        if ((i == null || i.isEmpty()) && (t == null || t.isEmpty())) {
            return ResponseEntity.badRequest().body("{\"Error\":\"Please provide either 'i' or 't' parameter.\"}");
        }
        
        String result = omdbService.searchByTitleOrId(i, t, type, y, plot, r);
        return ResponseEntity.ok(result);
    }
}
