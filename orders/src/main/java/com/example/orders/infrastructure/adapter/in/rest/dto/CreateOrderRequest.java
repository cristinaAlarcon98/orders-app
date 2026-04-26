package com.example.orders.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank(message = "customerName is required")
        String customerName,

        @NotBlank(message = "product is required")
        String product,

        @Min(value = 1, message = "quantity must be greater than 0")
        int quantity
) {}
