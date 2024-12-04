package com.ifconnect.api.Usuario;

import jakarta.validation.constraints.NotBlank;

public record DadosLoginUsuario(
		@NotBlank String matricula,
		@NotBlank String senha
		) {

}
