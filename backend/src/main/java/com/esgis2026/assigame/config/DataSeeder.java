package com.esgis2026.assigame.config;

import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.CategorieProduitRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Component
public class DataSeeder implements ApplicationRunner {

    private final CategorieProduitRepository categorieProduitRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DataSeeder(CategorieProduitRepository categorieProduitRepository, UtilisateurRepository utilisateurRepository) {
        this.categorieProduitRepository = categorieProduitRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedCategories();
        seedAdmin();
    }

    private void seedCategories() {
        if (categorieProduitRepository.count() > 0) {
            return;
        }

        List<CategorieProduit> categories = List.of(
                createCategorie("Gaming", "Consoles, jeux et accessoires"),
                createCategorie("Informatique", "PC portables et claviers"),
                createCategorie("Audio", "Casques et enceintes"),
                createCategorie("Composants", "CPU, GPU et stockage"),
                createCategorie("Écrans", "Moniteurs haute fréquence"),
                createCategorie("Montres connectées", "Suivi sport et santé")
        );

        categorieProduitRepository.saveAll(categories);
    }

    private void seedAdmin() {
        if (utilisateurRepository.existsByEmail("pierrette@dev.tg")) {
            return;
        }

        Utilisateur admin = new Utilisateur();
        admin.setNom("Pierrette");
        admin.setPrenom("Admin");
        admin.setEmail("pierrette@dev.tg");
        admin.setMotdepasse("pierrette1234");
        admin.setLogin("admin");
        admin.setStatut("admin");

        utilisateurRepository.save(admin);
    }

    private CategorieProduit createCategorie(String nom, String description) {
        CategorieProduit categorie = new CategorieProduit();
        categorie.setNom_categorieproduit(nom);
        categorie.setDescription(description);
        return categorie;
    }
}
