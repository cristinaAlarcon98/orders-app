package com.example.orders.infrastructure.config;

import com.example.orders.domain.model.Order;
import com.example.orders.domain.model.OrderStatus;
import com.example.orders.domain.port.out.OrderRepository;
import com.example.orders.infrastructure.adapter.out.batch.OrderItemProcessor;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.infrastructure.item.ItemReader;
import org.springframework.batch.infrastructure.item.support.ListItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class OrderBatchConfig {

    @Bean
    public ItemReader<Order> orderItemReader(OrderRepository orderRepository) {
        return new ListItemReader<>(orderRepository.findByStatus(OrderStatus.NEW));
    }

    @Bean
    public Step processOrdersStep(JobRepository jobRepository,
                                   PlatformTransactionManager transactionManager,
                                   ItemReader<Order> orderItemReader,
                                   OrderItemProcessor processor,
                                   OrderRepository orderRepository) {
        return new StepBuilder("processOrdersStep", jobRepository)
                .<Order, Order>chunk(10, transactionManager)
                .reader(orderItemReader)
                .processor(processor)
                .writer(chunk -> chunk.getItems().forEach(orderRepository::save))
                .build();
    }

    @Bean
    public Job processOrdersJob(JobRepository jobRepository, Step processOrdersStep) {
        return new JobBuilder("processOrdersJob", jobRepository)
                .start(processOrdersStep)
                .build();
    }
}
