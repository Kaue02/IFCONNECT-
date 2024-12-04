package com.ifconnect.api.Repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifconnect.api.Tag.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

	List<Tag> findByNomeContainingIgnoreCase(String query);

	List<Tag> findByNomeIn(List<String> nomes);
}
