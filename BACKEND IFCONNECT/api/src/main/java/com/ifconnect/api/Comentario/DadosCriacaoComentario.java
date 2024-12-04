package com.ifconnect.api.Comentario;

import jakarta.validation.constraints.NotBlank;

public record DadosCriacaoComentario(@NotBlank Long idUsuarioComentario, @NotBlank Long idPublicacao, @NotBlank String texto) {

}
