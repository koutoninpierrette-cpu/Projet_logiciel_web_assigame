package com.esgis2026.assigame.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String motDePasse;
}