package merliontechs.web.rest;

import liquibase.pro.packaged.T;
import merliontechs.domain.Product;
import merliontechs.domain.Sales;
import merliontechs.domain.enumeration.State;
import merliontechs.service.SalesService;
import merliontechs.web.rest.errors.BadRequestAlertException;
import merliontechs.service.dto.SalesCriteria;
import merliontechs.service.SalesQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.LongAdder;
import java.util.stream.Collectors;


/**
 * REST controller for managing {@link merliontechs.domain.Sales}.
 */
@RestController
@RequestMapping("/api")
public class SalesResource {

    private final Logger log = LoggerFactory.getLogger(SalesResource.class);

    private static final String ENTITY_NAME = "sales";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesService salesService;

    private final SalesQueryService salesQueryService;

    public SalesResource(SalesService salesService, SalesQueryService salesQueryService) {
        this.salesService = salesService;
        this.salesQueryService = salesQueryService;
    }

    /**
     * {@code POST  /sales} : Create a new sales.
     *
     * @param sales the sales to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sales, or with status {@code 400 (Bad Request)} if the sales has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales")
    public ResponseEntity<Sales> createSales(@RequestBody Sales sales) throws URISyntaxException {
        log.debug("REST request to save Sales : {}", sales);
        if (sales.getId() != null) {
            throw new BadRequestAlertException("A new sales cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sales result = salesService.save(sales);
        return ResponseEntity.created(new URI("/api/sales/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales} : Updates an existing sales.
     *
     * @param sales the sales to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sales,
     * or with status {@code 400 (Bad Request)} if the sales is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sales couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales")
    public ResponseEntity<Sales> updateSales(@RequestBody Sales sales) throws URISyntaxException {
        log.debug("REST request to update Sales : {}", sales);
        if (sales.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Sales result = salesService.save(sales);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sales.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /sales} : get all the sales.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sales in body.
     */
    @GetMapping("/sales")
    public ResponseEntity<List<Sales>> getAllSales(SalesCriteria criteria) {
        log.debug("REST request to get Sales by criteria: {}", criteria);
        List<Sales> entityList = salesQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
     * {@code GET  /sales/count} : count all the sales.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/sales/count")
    public ResponseEntity<Long> countSales(SalesCriteria criteria) {
        log.debug("REST request to count Sales by criteria: {}", criteria);
        return ResponseEntity.ok().body(salesQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /sales/count} : count all the sales.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/sales/countByDate")
    public ResponseEntity<JSONObject> countSalesByDate(SalesCriteria criteria) {
        log.debug("REST request to count Sales by criteria: {}", criteria);
        List<Sales> entityList = salesService.findAll();
        Map<LocalDate, LongAdder> salesCount= new HashMap<>();
        Map<LocalDate, LongAdder> deliveredCount= new HashMap<>();
        Map<Product, LongAdder> productCount= new HashMap<>();
        Map<Product, BigDecimal> productSum= new HashMap<>();
        entityList.forEach(sale -> {
            LocalDate localDate=sale.getDate();
            Product product=sale.getProduct();
            salesCount.putIfAbsent(localDate, new LongAdder());
            salesCount.get(localDate).increment();
        if (sale.getState() == State.DELIVERED) {
            deliveredCount.putIfAbsent(localDate, new LongAdder());
            deliveredCount.get(localDate).increment();
        }
        productCount.putIfAbsent(product, new LongAdder());
        productCount.get(product).increment();
        productSum.putIfAbsent(product, BigDecimal.ZERO);
        productSum.put(product, productSum.get(product).add(product.getPrice()));
            });
        JSONObject resp = getJsonArrays(salesCount, deliveredCount, productCount, productSum);

        return ResponseEntity.ok().body(resp);
    }

    private JSONObject getJsonArrays(Map<LocalDate, LongAdder> salesCount, Map<LocalDate, LongAdder> deliveredCount, Map<Product, LongAdder> productCount, Map<Product, BigDecimal> productSum) {
        JSONArray ar=countToJson(salesCount.entrySet().stream().sorted(Map.Entry.comparingByKey()).collect(Collectors.toList()),"date","amount");
        JSONArray b=countToJson(deliveredCount.entrySet().stream().sorted(Map.Entry.comparingByKey()).collect(Collectors.toList()),"date","amount");
        JSONArray c=countToJson(productCount.entrySet().stream().sorted((a,e)-> (int) (a.getValue().longValue() - e.getValue().longValue())).skip(Math.max(0, salesCount.size() - 4)).collect(Collectors.toList()),"product","amount");
        JSONArray d=countToJson(productSum.entrySet().stream().sorted(Map.Entry.comparingByValue()).skip(Math.max(0, salesCount.size() - 4)).collect(Collectors.toList()),"product","income");
        JSONObject o= new JSONObject();
        o.put("totalSales", ar);
        o.put("deliveredCount",b);
        o.put("productAmount",c);
        o.put("productIncome",d);
        return o;
    }

    private <N extends Number> JSONArray countToJson(List<Map.Entry<?,N>> count, String key1, String key2) {
        final JSONArray j=new JSONArray();
        count.forEach(entry -> {
            JSONObject m = new JSONObject();
            m.put(key1, entry.getKey().toString());
            m.put(key2, entry.getValue().toString());
            j.add(m);
        });
        return j;
    }

    /**
     * {@code GET  /sales/:id} : get the "id" sales.
     *
     * @param id the id of the sales to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sales, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales/{id}")
    public ResponseEntity<Sales> getSales(@PathVariable Long id) {
        log.debug("REST request to get Sales : {}", id);
        Optional<Sales> sales = salesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sales);
    }

    /**
     * {@code DELETE  /sales/:id} : delete the "id" sales.
     *
     * @param id the id of the sales to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales/{id}")
    public ResponseEntity<Void> deleteSales(@PathVariable Long id) {
        log.debug("REST request to delete Sales : {}", id);
        salesService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
