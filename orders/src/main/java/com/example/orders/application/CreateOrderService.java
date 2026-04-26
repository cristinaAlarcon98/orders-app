package com.example.orders.application;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.port.in.CreateOrderUseCase;
import com.example.orders.domain.port.out.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class CreateOrderService implements CreateOrderUseCase {

    private final OrderRepository orderRepository;

    public CreateOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order create(String customerName, String product, int quantity) {
        return orderRepository.save(Order.create(customerName, product, quantity));
    }
}
