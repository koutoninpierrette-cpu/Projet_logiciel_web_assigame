package com.esgis2026.assigame.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    @Query("SELECT u FROM Utilisateur u WHERE u.Email = :email")
    Optional<Utilisateur> findByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM Utilisateur u WHERE u.Email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM Utilisateur u WHERE u.Login = :login")
    boolean existsByLogin(@Param("login") String login);
}
