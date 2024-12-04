package com.ifconnect.api.Comentario;

import jakarta.validation.constraints.NotBlank;

public record DadosApagarComentario(
		@NotBlank
		Long idComentario) {

}
