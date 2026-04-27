package com.example.orders.infrastructure.adapter.out.batch;

import com.example.orders.domain.model.Order;
import org.springframework.batch.infrastructure.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OrderItemProcessor implements ItemProcessor<Order, Order> {

    private final Random random = new Random();

    @Override
    public Order process(Order order) {
        if (random.nextInt(10) == 0) {
            order.markAsFailed();
        } else {
            order.markAsProcessed();
        }
        return order;
    }
}
