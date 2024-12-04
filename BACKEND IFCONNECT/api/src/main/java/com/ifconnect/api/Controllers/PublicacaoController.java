package com.ifconnect.api.Controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifconnect.api.Publicacao.DadosCriacaoPublicacao;
import com.ifconnect.api.Publicacao.Publicacao;
import com.ifconnect.api.Repositorys.PublicacaoRepository;
import com.ifconnect.api.Repositorys.TagRepository;
import com.ifconnect.api.Repositorys.UsuarioRepository;
import com.ifconnect.api.Tag.Tag;
import com.ifconnect.api.Usuario.Usuario;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/publicacao")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class PublicacaoController {

	private final String PATH = "./src/main/resources/static/uploads/publicacao/";

	@Autowired
	private PublicacaoRepository publicacaoRepository;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private TagRepository tagRepository;

	@Autowired
	private ObjectMapper objectMapper;


	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@PostMapping("/{idUsuario}")
	@Transactional
	public ResponseEntity<Publicacao> criarPublicacao(@PathVariable Long idUsuario,
	        @RequestPart("dadosCriacao") String dadosCriacaoJson,
	        @RequestPart(name = "imagens", required = false) List<MultipartFile> imagens,
	        @RequestPart(name = "videos", required = false) List<MultipartFile> videos,
	        @RequestPart(name = "documento", required = false) MultipartFile documento) {

	    DadosCriacaoPublicacao dadosCriacao;
	    try {
	        dadosCriacao = objectMapper.readValue(dadosCriacaoJson, DadosCriacaoPublicacao.class);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	    }

	    Usuario user = usuarioRepository.findById(idUsuario)
	            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

	    Publicacao publicacao = new Publicacao();
	    publicacao.setTexto(dadosCriacao.texto());
	    publicacao.setUsuario(user);

	    List<Tag> tagsExistentes = tagRepository.findAllById(dadosCriacao.idTags());

	    List<Long> tagsNaoEncontradas = dadosCriacao.idTags().stream()
	            .filter(tagId -> tagsExistentes.stream().noneMatch(tag -> tag.getId().equals(tagId)))
	            .collect(Collectors.toList());

	    if (!tagsNaoEncontradas.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	    }

	    publicacao.setTags(tagsExistentes);
	    for (Tag tag : tagsExistentes) {
	        tag.getPublicacoes().add(publicacao);
	    }

	    List<String> fotos = new ArrayList<>();
	    List<String> videosList = new ArrayList<>();

	    if (imagens != null && !imagens.isEmpty()) {
	        for (MultipartFile imagem : imagens) {
	            String nomeImagem = imagem.getOriginalFilename();
	            try {
	                File file = new File(PATH + nomeImagem);
	                try (FileOutputStream fos = new FileOutputStream(file)) {
	                    fos.write(imagem.getBytes());
	                }
	                fotos.add(nomeImagem);
	            } catch (IOException e) {
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	            }
	        }
	    }
	    publicacao.setFotoNomes(fotos);

	    if (videos != null && !videos.isEmpty()) {
	        for (MultipartFile video : videos) {
	            String nomeVideo = video.getOriginalFilename();
	            try {
	                File file = new File(PATH + nomeVideo);
	                try (FileOutputStream fos = new FileOutputStream(file)) {
	                    fos.write(video.getBytes());
	                }
	                videosList.add(nomeVideo);
	            } catch (IOException e) {
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	            }
	        }
	    }
	    publicacao.setVideoNomes(videosList);

	    if (documento != null) {
	        String nomeDoc = documento.getOriginalFilename();
	        try {
	            File file = new File(PATH + nomeDoc);
	            try (FileOutputStream fos = new FileOutputStream(file)) {
	                fos.write(documento.getBytes());
	            }
	            publicacao.setDocNome(nomeDoc);
	        } catch (IOException e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	        }
	    }

	    publicacaoRepository.save(publicacao);
	    user.getPublicacoes().add(publicacao);
	    
	    return ResponseEntity.status(HttpStatus.CREATED).body(publicacao);
	}


	@GetMapping
	public ResponseEntity<List<Publicacao>> getTodasPublicacoes() {
		List<Publicacao> publicacoes = publicacaoRepository.findAll();
		if (publicacoes.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(publicacoes);
	}

	// Endpoint para trazer todas as publicações de um determinado usuário
	@GetMapping("/{idUsuario}")
	public ResponseEntity<List<Publicacao>> getPublicacoesPorUsuario(@PathVariable Long idUsuario) {
		Usuario usuario = usuarioRepository.findById(idUsuario)
				.orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

		List<Publicacao> publicacoes = usuario.getPublicacoes();
		if (publicacoes.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(publicacoes);
	}
	
	//Endpoint pra trazer publicações de 10 em 10, Ericzaummm 
	
	@GetMapping("/maisPublicacoes/{pagina}")
	public ResponseEntity<List<Publicacao>> getMaisPublicacoes(
	        @PathVariable int pagina,
	        @RequestParam(defaultValue = "10") int limite) {

	    PageRequest pageRequest = PageRequest.of(pagina - 1, limite); // A primeira página é a 0, então subtrai 1
	    Page<Publicacao> publicacoesPage = publicacaoRepository.findAll(pageRequest);

	    if (publicacoesPage.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }
	    return ResponseEntity.ok(publicacoesPage.getContent());
	}

}
