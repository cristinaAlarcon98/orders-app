package com.example.orders.domain.model;

import java.time.LocalDateTime;

public class Order {

    private Long id;
    private String customerName;
    private String product;
    private int quantity;
    private OrderStatus status;
    private LocalDateTime createdAt;

    private Order() {}

    public static Order create(String customerName, String product, int quantity) {
        Order order = new Order();
        order.customerName = customerName;
        order.product = product;
        order.quantity = quantity;
        order.status = OrderStatus.NEW;
        order.createdAt = LocalDateTime.now();
        return order;
    }

    public static Order reconstitute(Long id, String customerName, String product,
                                     int quantity, OrderStatus status, LocalDateTime createdAt) {
        Order order = new Order();
        order.id = id;
        order.customerName = customerName;
        order.product = product;
        order.quantity = quantity;
        order.status = status;
        order.createdAt = createdAt;
        return order;
    }

    public void markAsProcessed() {
        this.status = OrderStatus.PROCESSED;
    }

    public void markAsFailed() {
        this.status = OrderStatus.FAILED;
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
