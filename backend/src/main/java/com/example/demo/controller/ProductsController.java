package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Products;
import com.example.demo.repository.ProductsRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductsController {

    @Autowired
    private ProductsRepository repo;

    // CREATE
    @PostMapping
    public Products addProduct(@RequestBody Products product) {
        return repo.save(product);
    }

    // READ ALL
    @GetMapping
    public List<Products> getAllProducts() {
        return repo.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Products getProduct(@PathVariable String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // ✅ UPDATE (SAFE)
    @PutMapping("/{id}")
    public Products updateProduct(
            @PathVariable String id,
            @RequestBody Products updatedProduct) {

        Products existingProduct = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCategory(updatedProduct.getCategory());

        return repo.save(existingProduct);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable String id) {
        repo.deleteById(id);
        return "Product deleted successfully";
    }
}
