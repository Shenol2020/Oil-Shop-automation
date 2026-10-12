package DisanayakeOilCenter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @JsonProperty("pID")
    private Integer pID;
    private String p_name;
    private String volume;
    private int categoryID;
    private String brand;
    private int supplierID;
    private String price;
    private int current_stock_quantity;
    private String p_description;
    private String pic;


    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public Integer getpID() {
        return pID;
    }

    public void setpID(Integer pID) {
        this.pID = pID;
    }

    public String getP_name() {
        return p_name;
    }

    public void setP_name(String p_name) {
        this.p_name = p_name;
    }

    public String getP_description() {
        return p_description;
    }

    public void setP_description(String p_description) {
        this.p_description = p_description;
    }

    public String getVolume() {
        return volume;
    }

    public void setVolume(String volume) {
        this.volume = volume;
    }

    public int getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(int categoryID) {
        this.categoryID = categoryID;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getSupplierID() { return supplierID; }

    public void setSupplierID(int supplierID) { this.supplierID = supplierID; }
    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public int getCurrent_stock_quantity() { return current_stock_quantity;}
    public void setCurrent_stock_quantity(int current_stock_quantity) {
        this.current_stock_quantity = current_stock_quantity;
    }
}