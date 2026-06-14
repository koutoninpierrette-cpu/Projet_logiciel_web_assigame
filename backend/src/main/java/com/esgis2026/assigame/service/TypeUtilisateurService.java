package com.esgis2026.assigame.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.repository.TypeUtilisateurRepository;

@Service
public class TypeUtilisateurService {

    final TypeUtilisateurRepository typeUtilisateurRepository;

    public TypeUtilisateurService(TypeUtilisateurRepository typeUtilisateurRepository){
        this.typeUtilisateurRepository = typeUtilisateurRepository;
    }
    
    public List<TypeUtilisateur> getAllTypeUtilisateur(){
        return typeUtilisateurRepository.findAll();
    }

    public TypeUtilisateur createTypeUtilisateur(TypeUtilisateur typeUtilisateur){
        return typeUtilisateurRepository.save(typeUtilisateur);
    }

    public void deleteTypeUtilisateur(Long idTypeUtilisateur){
        typeUtilisateurRepository.deleteById(idTypeUtilisateur);
    }

    public TypeUtilisateur updateTypeUtilisateur(Long idTypeUtilisateur, TypeUtilisateur details ){
        TypeUtilisateur typeUtilisateur = typeUtilisateurRepository.findById(idTypeUtilisateur)
          .orElseThrow(() ->
                   new RuntimeException("TypeUtilisateur not found with id " + idTypeUtilisateur));
        typeUtilisateur.setNom_typeutilisateur(details.getNom_typeutilisateur());
        typeUtilisateur.setDescription_typeutilisateur(details.getDescription_typeutilisateur());
        return typeUtilisateurRepository.save(typeUtilisateur);
            
   
}



}
