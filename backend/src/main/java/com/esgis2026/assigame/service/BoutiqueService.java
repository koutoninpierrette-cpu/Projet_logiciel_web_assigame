package com.esgis2026.assigame.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.Boutique;
import com.esgis2026.assigame.repository.BoutiqueRepository;

@Service
public class BoutiqueService {

    private final BoutiqueRepository boutiqueRepository;

    public BoutiqueService(BoutiqueRepository boutiqueRepository) {
        this.boutiqueRepository = boutiqueRepository;
    }

    public List<Boutique> getAllBoutique() {
        return boutiqueRepository.findAll();
    }

    public Optional<Boutique> getBoutiqueByUser(Long idUtilisateur) {
        return boutiqueRepository.findByUtilisateurId(idUtilisateur);
    }

    public Boutique createBoutique(Boutique boutique) {
        if (boutique.getUtilisateur() != null && boutique.getUtilisateur().getId_utilisateur() != null
                && boutiqueRepository.findByUtilisateurId(boutique.getUtilisateur().getId_utilisateur()).isPresent()) {
            throw new IllegalArgumentException("Vous possédez déjà une boutique");
        }
        if (boutique.getStatut() == null || boutique.getStatut().isBlank()) {
            boutique.setStatut("active");
        }
        if (boutique.getDate_creation() == null) {
            boutique.setDate_creation(LocalDateTime.now());
        }
        return boutiqueRepository.save(boutique);
    }

    public void deleteBoutique(Long idBoutique) {
        boutiqueRepository.deleteById(idBoutique);
    }

    public Boutique updateBoutique(Long idBoutique, Boutique details) {
        Boutique boutique = boutiqueRepository.findById(idBoutique)
                .orElseThrow(() -> new RuntimeException("Boutique not found with id " + idBoutique));

        boutique.setNom_boutique(details.getNom_boutique());
        boutique.setDescription(details.getDescription());
        boutique.setLogo(details.getLogo());
        boutique.setStatut(details.getStatut());
        return boutiqueRepository.save(boutique);
    }
}
