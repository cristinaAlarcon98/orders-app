package com.example.orders.domain.port.out;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;

import java.util.List;

public interface OrderRepository {
    Order save(Order order);
    List<Order> findAll();
    List<Order> findByStatus(OrderStatus status);
}
