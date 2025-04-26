package com.example.demo.repository;

import com.example.demo.model.Rating;
import com.example.demo.model.Recipe;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndRecipe(User user, Recipe recipe);
    double getAverageRatingByRecipe(Recipe recipe);
} 