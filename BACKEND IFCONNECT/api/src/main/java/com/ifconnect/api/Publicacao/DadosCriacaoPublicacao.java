package com.ifconnect.api.Publicacao;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DadosCriacaoPublicacao(@NotBlank String texto,
		@Size(max = 10, message = "Máximo de 10 imagens") List<String> nomeFoto,
		@Size(max = 10, message = "Máximo de 10 vídeos") List<String> nomeVideo, String nomeDoc, List<Long> idTags) {
}
