package com.example.orders.infrastructure.adapter.out.persistence;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;
import com.example.orders.domain.port.out.OrderRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderPersistenceAdapter implements OrderRepository {

    private final SpringDataOrderRepository repository;

    public OrderPersistenceAdapter(SpringDataOrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public Order save(Order order) {
        return repository.save(OrderEntity.from(order)).toDomain();
    }

    @Override
    public List<Order> findAll() {
        return repository.findAll().stream()
                .map(OrderEntity::toDomain)
                .toList();
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return repository.findByStatus(status).stream()
                .map(OrderEntity::toDomain)
                .toList();
    }
}
