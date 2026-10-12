package DisanayakeOilCenter.service;

import DisanayakeOilCenter.dto.*;
import DisanayakeOilCenter.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResponseMapper {

    public SaleSummaryResponse toSaleSummaryResponse(Sale sale) {
        if (sale == null) {
            return null;
        }
        SaleSummaryResponse response = new SaleSummaryResponse();
        response.setSaleId(sale.getSaleId());
        response.setSaleDate(sale.getSaleDate());
        response.setSubtotal(sale.getSubtotal());
        response.setTotalAmount(sale.getTotalAmount());
        if (sale.getInvoice() != null) {
            response.setInvoiceId(sale.getInvoice().getInvoiceId());
            response.setInvoiceNumber(sale.getInvoice().getInvoiceNumber());
        }
        return response;
    }

    public SaleResponse toSaleResponse(Sale sale) {
        if (sale == null) {
            return null;
        }
        SaleResponse response = new SaleResponse();
        response.setSaleId(sale.getSaleId());
        response.setSaleDate(sale.getSaleDate());
        response.setSubtotal(sale.getSubtotal());
        response.setTotalAmount(sale.getTotalAmount());
        if (sale.getInvoice() != null) {
            response.setInvoiceId(sale.getInvoice().getInvoiceId());
            response.setInvoiceNumber(sale.getInvoice().getInvoiceNumber());
        }
        response.setItems(sale.getItems().stream()
                .map(this::toSaleItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        if (invoice == null) {
            return null;
        }
        InvoiceResponse response = new InvoiceResponse();
        response.setInvoiceId(invoice.getInvoiceId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setSale(toSaleSummaryResponse(invoice.getSale()));
        return response;
    }

    public PurchaseOrderResponse toPurchaseOrderResponse(PurchaseOrder order) {
        if (order == null) {
            return null;
        }
        PurchaseOrderResponse response = new PurchaseOrderResponse();
        response.setPurchaseOrderId(order.getPurchaseOrderId());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setSupplier(toSupplierSummaryResponse(order.getSupplier()));
        response.setItems(order.getItems().stream()
                .map(this::toPurchaseOrderItemResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public List<SaleResponse> toSaleResponses(List<Sale> sales) {
        return sales.stream().map(this::toSaleResponse).collect(Collectors.toList());
    }

    public List<PurchaseOrderResponse> toPurchaseOrderResponses(List<PurchaseOrder> orders) {
        return orders.stream().map(this::toPurchaseOrderResponse).collect(Collectors.toList());
    }

    private SaleItemResponse toSaleItemResponse(SaleItem item) {
        SaleItemResponse response = new SaleItemResponse();
        response.setSaleItemId(item.getSaleItemId());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setLineTotal(item.getLineTotal());
        if (item.getProduct() != null) {
            response.setProductId(item.getProduct().getpID());
            response.setProductName(item.getProduct().getP_name());
            response.setVolume(item.getProduct().getVolume());
            response.setBrand(item.getProduct().getBrand());
            response.setPrice(item.getProduct().getPrice());
        }
        return response;
    }

    private PurchaseOrderItemResponse toPurchaseOrderItemResponse(PurchaseOrderItem item) {
        PurchaseOrderItemResponse response = new PurchaseOrderItemResponse();
        response.setPurchaseOrderItemId(item.getPurchaseOrderItemId());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setLineTotal(item.getLineTotal());
        if (item.getProduct() != null) {
            response.setProductId(item.getProduct().getpID());
            response.setProductName(item.getProduct().getP_name());
            response.setVolume(item.getProduct().getVolume());
            response.setBrand(item.getProduct().getBrand());
            response.setPrice(item.getProduct().getPrice());
        }
        return response;
    }

    private SupplierSummaryResponse toSupplierSummaryResponse(Supplier supplier) {
        if (supplier == null) {
            return null;
        }
        SupplierSummaryResponse response = new SupplierSummaryResponse();
        response.setSupplierId(supplier.getSupplierId());
        response.setName(supplier.getName());
        response.setContactName(supplier.getContactName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        return response;
    }
}
