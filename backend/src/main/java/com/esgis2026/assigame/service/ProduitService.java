package com.esgis2026.assigame.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.repository.ProduitRepository;

@Service
public class ProduitService {
    final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository ){
        this.produitRepository = produitRepository; 
    }

    public List<Produit> getAllProduit(){
        return produitRepository.findAll();
    }
    
    public Produit createProduit(Produit produit){
        return produitRepository.save(produit);
    }

    public void deleteProduit(Long idProduit){
        produitRepository.deleteById(idProduit);
    }

    public Produit updateProduit(Long idProduit, Produit details){
        Produit produit = produitRepository.findById(idProduit)
         .orElseThrow(() -> 
                 new RuntimeException("Produit not found with id " + idProduit));
    produit.setNom_produit(details.getNom_produit());
    produit.setDescription(details.getDescription());
    produit.setPrix(details.getPrix());

    return produitRepository.save(produit);

    }
    

    

}
