package de.akquinet.angularjs.dao;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import junit.framework.Assert;

import org.junit.Rule;
import org.junit.Test;

import de.akquinet.angularjs.User;
import de.akquinet.angularjs.testdata.UserTestdataBuilder;
import de.akquinet.jbosscc.needle.annotation.ObjectUnderTest;
import de.akquinet.jbosscc.needle.junit.DatabaseRule;
import de.akquinet.jbosscc.needle.junit.NeedleRule;

public class UserDaoTest {

	@Rule
	public DatabaseRule databaseRule = new DatabaseRule();

	@Rule
	public NeedleRule needleRule = new NeedleRule(databaseRule);

	@Inject
	private EntityManager entityManager;

	@ObjectUnderTest
	private UserDaoBean userDao;

	@Test
	public void testFindByUsername() throws Exception {

		User user = new UserTestdataBuilder(entityManager).buildAndSave();

		User findByUsername = userDao.findByUsername(user.getUsername());

		Assert.assertEquals(user.getId(), findByUsername.getId());

		User other = userDao.findByUsername("name");
		Assert.assertNull(other);
	}

	@Test
	public void testCountUserByEmail() throws Exception {

		User user = new UserTestdataBuilder(entityManager).buildAndSave();

		Long count = userDao.countUserByEmail(user.getEmail());

		Assert.assertEquals(Long.valueOf(1), count);

	}

}
