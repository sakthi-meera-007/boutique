package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.Products;

public interface ProductsRepository
        extends MongoRepository<Products, String> {
}
