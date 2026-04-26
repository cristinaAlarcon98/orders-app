package com.example.orders.application;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;
import com.example.orders.domain.port.in.GetOrdersUseCase;
import com.example.orders.domain.port.out.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetOrdersService implements GetOrdersUseCase {

    private final OrderRepository orderRepository;

    public GetOrdersService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
