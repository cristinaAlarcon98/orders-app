package com.example.orders.application;

import com.example.orders.domain.port.in.GetProductsUseCase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetProductsService implements GetProductsUseCase {

    private static final List<String> PRODUCTS = List.of(
            "Laptop", "Laptop Gaming", "Ultrabook", "MacBook",
            "Monitor 24\"", "Monitor 27\" 4K", "Monitor Ultrawide",
            "Teclado Mecánico", "Teclado Inalámbrico", "Teclado Compacto",
            "Ratón Ergonómico", "Ratón Gaming", "Ratón Inalámbrico",
            "Auriculares Bluetooth", "Auriculares Noise Cancelling", "Auriculares Gaming",
            "Webcam HD", "Webcam 4K",
            "Disco SSD 500GB", "Disco SSD 1TB", "Disco Duro Externo 2TB",
            "Impresora Láser", "Impresora Multifunción",
            "Tablet", "iPad"
    );

    @Override
    public List<String> getAll() {
        return PRODUCTS;
    }
}
