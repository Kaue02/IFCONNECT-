package com.ifconnect.api.Controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ifconnect.api.Publicacao.Publicacao;
import com.ifconnect.api.Repositorys.PublicacaoRepository;
import com.ifconnect.api.Repositorys.UsuarioRepository;
import com.ifconnect.api.Usuario.Usuario;

import jakarta.persistence.EntityNotFoundException;

@Controller
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class FileController {

	@Autowired
	private UsuarioRepository usuarioRepo;

	@Autowired
	private PublicacaoRepository publicacaoRepo;

	private final String USER_PATH = "./src/main/resources/static/uploads/";
	private final String PUBLICACAO_PATH = "./src/main/resources/static/uploads/publicacao/";

	// Endpoint para recuperar informações do usuário pelo ID
	@GetMapping("/user/{id}")
	public ResponseEntity<Usuario> getUser(@PathVariable Long id) {
		Usuario user = usuarioRepo.findUsuarioById(id);
		if (user != null) {
			return ResponseEntity.ok(user);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// Endpoint para upload de imagens de perfil e banner do usuário
	@PostMapping("/upload/{id}/{arquivo}")
	public ResponseEntity<String> uploadUsuarioImagem(@RequestParam MultipartFile file, @PathVariable Long id,
			@PathVariable String arquivo) {
		Usuario user = usuarioRepo.findUsuarioById(id);
		if (user == null) {
			return ResponseEntity.notFound().build();
		}

		try {
			String nomeArquivo = file.getOriginalFilename();
			File f = new File(String.format("%s%s", USER_PATH, nomeArquivo));
			try (FileOutputStream fos = new FileOutputStream(f)) {
				fos.write(file.getBytes());
			}

			if ("fotoBanner".equals(arquivo)) {
				user.setFotoBanner(nomeArquivo);
			} else {
				user.setFotoPerfil(nomeArquivo);
			}

			usuarioRepo.save(user);
			return ResponseEntity.ok("Arquivo de usuário recebido com sucesso.");
		} catch (Exception e) {
			System.err.println("Erro ao escrever arquivo... " + e.getMessage());
			return ResponseEntity.badRequest().body("Erro ao enviar o arquivo.");
		}
	}

	// Endpoint para upload de múltiplas imagens para uma publicação específica
	@PostMapping("/publicacao/upload/{idUsuario}/{idPublicacao}")
	public ResponseEntity<String> uploadImagensPublicacao(@RequestParam("files") List<MultipartFile> files,
			@PathVariable Long idUsuario, @PathVariable Long idPublicacao) {
		Usuario user = usuarioRepo.findUsuarioById(idUsuario);
		if (user == null) {
			return ResponseEntity.notFound().build();
		}

		Publicacao publicacao = publicacaoRepo.findById(idPublicacao)
				.orElseThrow(() -> new EntityNotFoundException("Publicação não encontrada"));

		List<String> nomesArquivos = new ArrayList<>();

		try {
			for (MultipartFile file : files) {
				String nomeArquivo = file.getOriginalFilename();
				File f = new File(PUBLICACAO_PATH + nomeArquivo);
				try (FileOutputStream fos = new FileOutputStream(f)) {
					fos.write(file.getBytes());
				}
				nomesArquivos.add(nomeArquivo);
			}

			publicacao.setFotoNomes(nomesArquivos);
			publicacaoRepo.save(publicacao);

			return ResponseEntity.ok("Arquivos de imagem da publicação recebidos com sucesso.");
		} catch (IOException e) {
			System.err.println("Erro ao salvar arquivos de imagem: " + e.getMessage());
			return ResponseEntity.badRequest().body("Erro ao enviar os arquivos.");
		}
	}

	// Endpoint para recuperar os arquivos de uma publicação específica
	@GetMapping("/publicacao/{idPublicacao}/arquivos")
	public ResponseEntity<List<String>> getPublicacaoArquivos(@PathVariable Long idPublicacao) {
		Publicacao publicacao = publicacaoRepo.findById(idPublicacao)
				.orElseThrow(() -> new EntityNotFoundException("Publicação não encontrada"));

		List<String> arquivos = publicacao.getFotoNomes().stream()
				.map(nomeArquivo -> "/uploads/publicacao/" + nomeArquivo).collect(Collectors.toList());

		return ResponseEntity.ok(arquivos);
	}

	// Endpoint para download de arquivo específico de uma publicação
	@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
	@GetMapping("/publicacao/arquivo/{nomeArquivo}")
	public ResponseEntity<Resource> downloadArquivo(@PathVariable String nomeArquivo) {
		try {
			File file = new File(PUBLICACAO_PATH + nomeArquivo);
			Resource resource = new UrlResource(file.toURI());

			if (resource.exists()) {
				return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=\"" + resource.getFilename() + "\"").body(resource);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
