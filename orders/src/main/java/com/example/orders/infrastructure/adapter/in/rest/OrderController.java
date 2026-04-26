package com.example.orders.infrastructure.adapter.in.rest;

import com.example.orders.domain.model.OrderStatus;
import com.example.orders.domain.port.in.CreateOrderUseCase;
import com.example.orders.domain.port.in.GetOrdersUseCase;
import com.example.orders.domain.port.in.RunBatchUseCase;
import com.example.orders.infrastructure.adapter.in.rest.dto.CreateOrderRequest;
import com.example.orders.infrastructure.adapter.in.rest.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final GetOrdersUseCase getOrdersUseCase;
    private final RunBatchUseCase runBatchUseCase;

    public OrderController(CreateOrderUseCase createOrderUseCase,
                           GetOrdersUseCase getOrdersUseCase,
                           RunBatchUseCase runBatchUseCase) {
        this.createOrderUseCase = createOrderUseCase;
        this.getOrdersUseCase = getOrdersUseCase;
        this.runBatchUseCase = runBatchUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return OrderResponse.from(
                createOrderUseCase.create(request.customerName(), request.product(), request.quantity())
        );
    }

    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam(required = false) OrderStatus status) {
        List<com.example.orders.domain.model.Order> orders = status != null
                ? getOrdersUseCase.getByStatus(status)
                : getOrdersUseCase.getAll();
        return orders.stream().map(OrderResponse::from).toList();
    }

    @PostMapping("/batch/run")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void runBatch() {
        runBatchUseCase.run();
    }
}
