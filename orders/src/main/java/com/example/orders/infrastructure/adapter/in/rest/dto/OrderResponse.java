package com.example.orders.infrastructure.adapter.in.rest.dto;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;

import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        String customerName,
        String product,
        int quantity,
        OrderStatus status,
        LocalDateTime createdAt
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getProduct(),
                order.getQuantity(),
                order.getStatus(),
                order.getCreatedAt()
        );
    }
}
