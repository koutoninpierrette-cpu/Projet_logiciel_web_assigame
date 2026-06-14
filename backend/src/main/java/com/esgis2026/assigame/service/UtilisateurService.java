package com.esgis2026.assigame.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Utilisateur> getAllUtilisateur() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Long idUtilisateur) {
        return utilisateurRepository.findById(idUtilisateur);
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet e-mail");
        }
        if (utilisateurRepository.existsByLogin(utilisateur.getLogin())) {
            throw new IllegalArgumentException("Ce login est déjà utilisé");
        }
        if (utilisateur.getStatut() == null || utilisateur.getStatut().isBlank()) {
            utilisateur.setStatut("actif");
        }
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur authenticate(String email, String motdepasse) {
        return utilisateurRepository.findByEmail(email)
                .filter(u -> u.getMotdepasse().equals(motdepasse))
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou mot de passe incorrect"));
    }

    public void deleteUtilisateur(Long idUtilisateur) {
        utilisateurRepository.deleteById(idUtilisateur);
    }

    public Utilisateur updateUtilisateur(Long idUtilisateur, Utilisateur details) {

        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur not found with id "+ idUtilisateur));

     if (details.getNom() != null) utilisateur.setNom(details.getNom());
     if (details.getPrenom() != null) utilisateur.setPrenom(details.getPrenom());
     if (details.getEmail() != null) utilisateur.setEmail(details.getEmail());
     if (details.getMotdepasse() != null) utilisateur.setMotdepasse(details.getMotdepasse());
     if (details.getTelephone() != null) utilisateur.setTelephone(details.getTelephone());

     return utilisateurRepository.save(utilisateur);
    }                 

       


       
}
