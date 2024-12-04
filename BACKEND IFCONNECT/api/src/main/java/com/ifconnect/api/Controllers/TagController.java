package com.ifconnect.api.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifconnect.api.Repositorys.TagRepository;
import com.ifconnect.api.Tag.DadosCriacaoTag;
import com.ifconnect.api.Tag.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class TagController {
	
	@Autowired
	private TagRepository tagRepository;
	
	@PostMapping
	private ResponseEntity<Tag> criarTag(@RequestBody @Valid DadosCriacaoTag dadosTag){
		Tag tag = new Tag();
		tag.setCor(dadosTag.cor());
		tag.setNome(dadosTag.nome());
		
		tagRepository.save(tag);
		return new ResponseEntity<>(tag, HttpStatus.CREATED);
	}
	
	@GetMapping
	private ResponseEntity<List<Tag>> buscarTags(@RequestParam(required = false) String query) {
		List<Tag> tags;

		if (query == null || query.isEmpty()) {
			tags = tagRepository.findAll();
		} else {
			tags = tagRepository.findByNomeContainingIgnoreCase(query);
		}

		return ResponseEntity.ok(tags);
	}
}



















