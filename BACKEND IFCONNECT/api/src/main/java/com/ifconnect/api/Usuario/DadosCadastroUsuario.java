package com.ifconnect.api.Usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosCadastroUsuario(
		@NotBlank
		String nome,
		@NotBlank
		@Email
		String email,
		@NotBlank
		String matricula,
		@NotBlank
		String senha,
		@NotBlank
		String tipoUsuario) {
	
}
