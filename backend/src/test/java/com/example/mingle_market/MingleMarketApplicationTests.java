package com.example.mingle_market;

import java.sql.Connection;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MingleMarketApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	void dbConnectionTest() throws Exception {
		Connection conn = dataSource.getConnection();
		System.out.println("연결 성공" + conn);
		conn.close();
	}

}
