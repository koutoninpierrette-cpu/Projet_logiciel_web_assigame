package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.dto.LoginResponse;
import com.esgis2026.assigame.dto.RegisterRequest;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;
import com.esgis2026.assigame.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail()).orElseThrow();

        String role = utilisateur.getTypeutilisateur() != null
                ? utilisateur.getTypeutilisateur().getNom_typeutilisateur()
                : "ACHETEUR";

        return ResponseEntity.ok(new LoginResponse(token, utilisateur.getEmail(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé.");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotdepasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setLogin(request.getEmail());
        utilisateur.setStatut("ACTIF");

        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok("Compte créé avec succès.");
    }
}