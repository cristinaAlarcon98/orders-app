package com.example.orders.domain.port.in;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;

import java.util.List;

public interface GetOrdersUseCase {
    List<Order> getAll();
    List<Order> getByStatus(OrderStatus status);
}
