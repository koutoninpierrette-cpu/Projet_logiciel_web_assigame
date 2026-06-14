package com.esgis2026.assigame.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.service.CategorieProduitService;

@RestController
@RequestMapping("/api/categorieproduit")
public class CategorieProduitController {
    
    private final CategorieProduitService categorieProduitService;

    public CategorieProduitController(CategorieProduitService categorieProduitService) {
        this.categorieProduitService = categorieProduitService;
    }

    @GetMapping("/list")
    public List<CategorieProduit>getAllCategorieProduit(){
        return categorieProduitService.getAllCategorieProduit();
    }

    @PostMapping("/add")
    public CategorieProduit addCategorieProduit(@RequestBody CategorieProduit categorieProduit){
        return categorieProduitService.createCategorieProduit(categorieProduit);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategorieProduit> updateCategorieProduit(
            @PathVariable Long id,
            @RequestBody CategorieProduit categorieProduit) {
        return ResponseEntity.ok(categorieProduitService.updateCategorieProduit(id, categorieProduit));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategorieProduit(@PathVariable Long id) {
        categorieProduitService.deleteCategorieProduit(id);
        return ResponseEntity.noContent().build();
    }

     
 }

