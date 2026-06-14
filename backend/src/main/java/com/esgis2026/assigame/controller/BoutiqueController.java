package com.esgis2026.assigame.controller;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
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

import com.esgis2026.assigame.entity.Boutique;
import com.esgis2026.assigame.service.BoutiqueService;

@RestController
@RequestMapping("/api/boutique")
public class BoutiqueController {

    private final BoutiqueService boutiqueService;

    public BoutiqueController(BoutiqueService boutiqueService) {
        this.boutiqueService = boutiqueService;
    }

    @GetMapping("/list")
    public List<Boutique> getAllBoutique() {
        return boutiqueService.getAllBoutique();
    }

    @GetMapping("/by-user/{idUtilisateur}")
    public ResponseEntity<Boutique> getBoutiqueByUser(@PathVariable Long idUtilisateur) {
        return boutiqueService.getBoutiqueByUser(idUtilisateur)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("/add")
    public Boutique addBoutique(@RequestBody Boutique boutique) {
        return boutiqueService.createBoutique(boutique);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Boutique> updateBoutique(
            @PathVariable Long id,
            @RequestBody Boutique boutique) {
        return ResponseEntity.ok(boutiqueService.updateBoutique(id, boutique));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBoutique(@PathVariable Long id) {
        boutiqueService.deleteBoutique(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Ce nom de boutique est déjà utilisé."));
    }
}
