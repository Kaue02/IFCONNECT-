package com.ifconnect.api.Tag;

import jakarta.validation.constraints.NotBlank;

public record DadosCriacaoTag(
		@NotBlank
		String nome,
		@NotBlank
		String cor
		
		) {

}
