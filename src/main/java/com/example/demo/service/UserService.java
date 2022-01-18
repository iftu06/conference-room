package com.example.demo.service;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Created by Divineit-Iftekher on 2/16/2018.
 */
@Service
public class UserService extends BaseService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @Autowired
    UserService(UserRepository userRepository, RoleRepository roleRepository) {
        super(userRepository, "User");
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }


    public User findByUserName(String userName) {
        return userRepository.findByUsername(userName);
    }

    public User findByEmail(String email) {
        return userRepository.findByUsername(email);
    }

    @Transactional
    public void saveUser(User user) {
        Role role = roleRepository.findByName("ROLE_USER");
        user.getRoles().add(role);
        user.setActive(1);
        this.userRepository.save(user);
    }

    public List<User> list() {
        if(userRepository == null){
            System.out.println("why i am null");
        }
        List<User> users = userRepository.findAll();
        return users;
    }

    public Optional<User> findUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user;
    }

    public void getUser(){
       CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
       CriteriaQuery <User>criteriaQuery = criteriaBuilder.createQuery(User.class);
       Root<User> root = criteriaQuery.from(User.class);
    }


}
