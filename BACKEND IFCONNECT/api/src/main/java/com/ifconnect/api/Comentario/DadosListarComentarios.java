package com.ifconnect.api.Comentario;

import jakarta.validation.constraints.NotBlank;

public record DadosListarComentarios(

		@NotBlank Long idPublicacao

) {

}
