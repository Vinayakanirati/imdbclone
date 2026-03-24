package com.movie.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String imdbId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "release_year")
    private String year;
    
    private String type;
    
    private String poster;
    
    @Column(columnDefinition = "TEXT")
    private String plot;

    public Movie() {}

    public Movie(String imdbId, String title, String year, String type, String poster, String plot) {
        this.imdbId = imdbId;
        this.title = title;
        this.year = year;
        this.type = type;
        this.poster = poster;
        this.plot = plot;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getImdbId() { return imdbId; }
    public void setImdbId(String imdbId) { this.imdbId = imdbId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }
    
    public String getPlot() { return plot; }
    public void setPlot(String plot) { this.plot = plot; }
}
