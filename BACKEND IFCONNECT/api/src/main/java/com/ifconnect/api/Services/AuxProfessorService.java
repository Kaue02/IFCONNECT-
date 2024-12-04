package com.ifconnect.api.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class AuxProfessorService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public void insetAuxProfessores() {
		String sqlCheck = "SELECT COUNT(*) FROM aux_professor WHERE matricula = ?";
		String sqlInsert = "INSERT INTO aux_professor (matricula) VALUES (?)";
		String[] matriculas = { "1033384", "3038730", "2088795", "2743074", "3302081", "3290214", "1112812", "1333230",
				"1566705", "1998549", "1824449", "3057115", "1312297", "1218660", "3324089", "1509712", "2073670",
				"3142904", "3148281", "1227162", "2643936", "1354253", "3339513", "1209664", "1522807", "2256932",
				"3182024", "1212691", "1220264", "1067915", "1202835", "3364887", "3400785", "1069569", "2418664",
				"1472754", "1012511", "1278675", "2164915", "2221065", "1191018", "3141882", "2406173", "1935800",
				"1459895", "3239147", "1050534", "2338198", "1219470", "3367477", "3140235", "2146690", "1173708",
				"1770374", "3244982", "4843106", "2087560", "1418706", "1770064", "3299603", "1227147", "2612394",
				"3419479", "2299477", "1299477", "1695191", "1883227", "2344580", "1943792", "3182727", "1024001",
				"2688822", "3128919", "1973174", "1746698", "2327010", "1672887", "3143485", "1174555", "1940231",
				"3293594", "1646283", "2814987", "1315469", "3888282", "1680792", "1157005", "3351316", "1888802",
				"1251211", "1548856", "1936939", "3351663", "2248850", "1303305", "1278199", "1029366", "2735536",
				"3299342", "3159210", "3419323", "2612027", "3147542", "2646626", "1280968", "1884026", "3356330",
				"2302082", "1926253", "3401559", "2138927", "1005458", "1631329" };

		for (String matricula : matriculas) {
			Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, matricula);
			if (count == null || count == 0) {
				jdbcTemplate.update(sqlInsert, matricula);
			}
		}

	}

	@PostConstruct
	public void init() {
		insetAuxProfessores();
	}

}
