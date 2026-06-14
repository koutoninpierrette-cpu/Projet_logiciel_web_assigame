package com.esgis2026.assigame.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Boutique;

@Repository
public interface BoutiqueRepository extends JpaRepository<Boutique, Long> {

    @Query("SELECT b FROM Boutique b WHERE b.utilisateur.id_utilisateur = :idUtilisateur")
    Optional<Boutique> findByUtilisateurId(@Param("idUtilisateur") Long idUtilisateur);
}
