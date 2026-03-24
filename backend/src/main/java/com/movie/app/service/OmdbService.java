package com.movie.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class OmdbService {

    @Value("${omdb.api.url:https://www.omdbapi.com/}")
    private String apiUrl;

    @Value("${omdb.api.key:a4f04e4}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    public String searchByTitleOrId(String i, String t, String type, String y, String plot, String r) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl)
                .queryParam("apikey", apiKey);
        
        if (i != null && !i.isEmpty()) builder.queryParam("i", i);
        if (t != null && !t.isEmpty()) builder.queryParam("t", t);
        if (type != null && !type.isEmpty()) builder.queryParam("type", type);
        if (y != null && !y.isEmpty()) builder.queryParam("y", y);
        if (plot != null && !plot.isEmpty()) builder.queryParam("plot", plot);
        if (r != null && !r.isEmpty()) builder.queryParam("r", r);

        return restTemplate.getForObject(builder.toUriString(), String.class);
    }

    public String searchMovies(String s, String type, String y, String r, Integer page) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl)
                .queryParam("apikey", apiKey);

        if (s != null && !s.isEmpty()) builder.queryParam("s", s);
        if (type != null && !type.isEmpty()) builder.queryParam("type", type);
        if (y != null && !y.isEmpty()) builder.queryParam("y", y);
        if (r != null && !r.isEmpty()) builder.queryParam("r", r);
        if (page != null) builder.queryParam("page", page);

        return restTemplate.getForObject(builder.toUriString(), String.class);
    }
}
