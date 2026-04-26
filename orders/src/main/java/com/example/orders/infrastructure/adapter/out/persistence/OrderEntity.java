package com.example.orders.infrastructure.adapter.out.persistence;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String product;

    @Column(nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public static OrderEntity from(Order order) {
        OrderEntity entity = new OrderEntity();
        entity.id = order.getId();
        entity.customerName = order.getCustomerName();
        entity.product = order.getProduct();
        entity.quantity = order.getQuantity();
        entity.status = order.getStatus();
        entity.createdAt = order.getCreatedAt();
        return entity;
    }

    public Order toDomain() {
        return Order.reconstitute(id, customerName, product, quantity, status, createdAt);
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
