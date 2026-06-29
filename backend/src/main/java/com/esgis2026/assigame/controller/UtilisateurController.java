package com.esgis2026.assigame.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.service.UtilisateurService;

@RestController
@RequestMapping("/api/utilisateur")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/list")
    public List<Utilisateur> getAllUtilisateur() {
        return utilisateurService.getAllUtilisateur();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        return utilisateurService.getUtilisateurById(id)
                .map(utilisateur -> {
                    utilisateur.setMotdepasse(null);
                    return ResponseEntity.ok(utilisateur);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public Utilisateur addUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur created = utilisateurService.createUtilisateur(utilisateur);
        created.setMotdepasse(null);
        return created;
    }

    @PostMapping("/login")
    public Utilisateur login(@RequestBody LoginRequest request) {
        Utilisateur utilisateur = utilisateurService.authenticate(request.getEmail(), request.getMotDePasse());
        utilisateur.setMotdepasse(null);
        return utilisateur;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.updateUtilisateur(id, utilisateur));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
