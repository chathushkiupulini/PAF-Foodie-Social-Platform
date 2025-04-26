package com.example.demo.repository;

import com.example.demo.model.Recipe;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findByUser(User user, Pageable pageable);
    Page<Recipe> findByIsPublicTrue(Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.isPublic = true AND :tag MEMBER OF r.tags")
    Page<Recipe> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.isPublic = true AND r.title LIKE %:query% OR r.description LIKE %:query%")
    Page<Recipe> search(@Param("query") String query, Pageable pageable);
    
    List<Recipe> findByUserAndIsPublicTrue(User user);
} 