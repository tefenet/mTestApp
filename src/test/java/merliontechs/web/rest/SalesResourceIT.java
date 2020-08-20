package merliontechs.web.rest;

import merliontechs.TestApp;
import merliontechs.domain.Sales;
import merliontechs.domain.Product;
import merliontechs.repository.SalesRepository;
import merliontechs.service.SalesService;
import merliontechs.service.dto.SalesCriteria;
import merliontechs.service.SalesQueryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import merliontechs.domain.enumeration.State;
/**
 * Integration tests for the {@link SalesResource} REST controller.
 */
@SpringBootTest(classes = TestApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SalesResourceIT {

    private static final State DEFAULT_STATE = State.IN_CHARGE;
    private static final State UPDATED_STATE = State.SHIPPED;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_DATE = LocalDate.ofEpochDay(-1L);

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private SalesService salesService;

    @Autowired
    private SalesQueryService salesQueryService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesMockMvc;

    private Sales sales;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sales createEntity(EntityManager em) {
        Sales sales = new Sales()
            .state(DEFAULT_STATE)
            .date(DEFAULT_DATE);
        return sales;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sales createUpdatedEntity(EntityManager em) {
        Sales sales = new Sales()
            .state(UPDATED_STATE)
            .date(UPDATED_DATE);
        return sales;
    }

    @BeforeEach
    public void initTest() {
        sales = createEntity(em);
    }

    @Test
    @Transactional
    public void createSales() throws Exception {
        int databaseSizeBeforeCreate = salesRepository.findAll().size();
        // Create the Sales
        restSalesMockMvc.perform(post("/api/sales")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isCreated());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeCreate + 1);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testSales.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createSalesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = salesRepository.findAll().size();

        // Create the Sales with an existing ID
        sales.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesMockMvc.perform(post("/api/sales")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList
        restSalesMockMvc.perform(get("/api/sales?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sales.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get the sales
        restSalesMockMvc.perform(get("/api/sales/{id}", sales.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sales.getId().intValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }


    @Test
    @Transactional
    public void getSalesByIdFiltering() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        Long id = sales.getId();

        defaultSalesShouldBeFound("id.equals=" + id);
        defaultSalesShouldNotBeFound("id.notEquals=" + id);

        defaultSalesShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultSalesShouldNotBeFound("id.greaterThan=" + id);

        defaultSalesShouldBeFound("id.lessThanOrEqual=" + id);
        defaultSalesShouldNotBeFound("id.lessThan=" + id);
    }


    @Test
    @Transactional
    public void getAllSalesByStateIsEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where state equals to DEFAULT_STATE
        defaultSalesShouldBeFound("state.equals=" + DEFAULT_STATE);

        // Get all the salesList where state equals to UPDATED_STATE
        defaultSalesShouldNotBeFound("state.equals=" + UPDATED_STATE);
    }

    @Test
    @Transactional
    public void getAllSalesByStateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where state not equals to DEFAULT_STATE
        defaultSalesShouldNotBeFound("state.notEquals=" + DEFAULT_STATE);

        // Get all the salesList where state not equals to UPDATED_STATE
        defaultSalesShouldBeFound("state.notEquals=" + UPDATED_STATE);
    }

    @Test
    @Transactional
    public void getAllSalesByStateIsInShouldWork() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where state in DEFAULT_STATE or UPDATED_STATE
        defaultSalesShouldBeFound("state.in=" + DEFAULT_STATE + "," + UPDATED_STATE);

        // Get all the salesList where state equals to UPDATED_STATE
        defaultSalesShouldNotBeFound("state.in=" + UPDATED_STATE);
    }

    @Test
    @Transactional
    public void getAllSalesByStateIsNullOrNotNull() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where state is not null
        defaultSalesShouldBeFound("state.specified=true");

        // Get all the salesList where state is null
        defaultSalesShouldNotBeFound("state.specified=false");
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date equals to DEFAULT_DATE
        defaultSalesShouldBeFound("date.equals=" + DEFAULT_DATE);

        // Get all the salesList where date equals to UPDATED_DATE
        defaultSalesShouldNotBeFound("date.equals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date not equals to DEFAULT_DATE
        defaultSalesShouldNotBeFound("date.notEquals=" + DEFAULT_DATE);

        // Get all the salesList where date not equals to UPDATED_DATE
        defaultSalesShouldBeFound("date.notEquals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsInShouldWork() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date in DEFAULT_DATE or UPDATED_DATE
        defaultSalesShouldBeFound("date.in=" + DEFAULT_DATE + "," + UPDATED_DATE);

        // Get all the salesList where date equals to UPDATED_DATE
        defaultSalesShouldNotBeFound("date.in=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date is not null
        defaultSalesShouldBeFound("date.specified=true");

        // Get all the salesList where date is null
        defaultSalesShouldNotBeFound("date.specified=false");
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date is greater than or equal to DEFAULT_DATE
        defaultSalesShouldBeFound("date.greaterThanOrEqual=" + DEFAULT_DATE);

        // Get all the salesList where date is greater than or equal to UPDATED_DATE
        defaultSalesShouldNotBeFound("date.greaterThanOrEqual=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date is less than or equal to DEFAULT_DATE
        defaultSalesShouldBeFound("date.lessThanOrEqual=" + DEFAULT_DATE);

        // Get all the salesList where date is less than or equal to SMALLER_DATE
        defaultSalesShouldNotBeFound("date.lessThanOrEqual=" + SMALLER_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsLessThanSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date is less than DEFAULT_DATE
        defaultSalesShouldNotBeFound("date.lessThan=" + DEFAULT_DATE);

        // Get all the salesList where date is less than UPDATED_DATE
        defaultSalesShouldBeFound("date.lessThan=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    public void getAllSalesByDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList where date is greater than DEFAULT_DATE
        defaultSalesShouldNotBeFound("date.greaterThan=" + DEFAULT_DATE);

        // Get all the salesList where date is greater than SMALLER_DATE
        defaultSalesShouldBeFound("date.greaterThan=" + SMALLER_DATE);
    }


    @Test
    @Transactional
    public void getAllSalesByProductIsEqualToSomething() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);
        Product product = ProductResourceIT.createEntity(em);
        em.persist(product);
        em.flush();
        sales.setProduct(product);
        salesRepository.saveAndFlush(sales);
        Long productId = product.getId();

        // Get all the salesList where product equals to productId
        defaultSalesShouldBeFound("productId.equals=" + productId);

        // Get all the salesList where product equals to productId + 1
        defaultSalesShouldNotBeFound("productId.equals=" + (productId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultSalesShouldBeFound(String filter) throws Exception {
        restSalesMockMvc.perform(get("/api/sales?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sales.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));

        // Check, that the count call also returns 1
        restSalesMockMvc.perform(get("/api/sales/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultSalesShouldNotBeFound(String filter) throws Exception {
        restSalesMockMvc.perform(get("/api/sales?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restSalesMockMvc.perform(get("/api/sales/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    public void getNonExistingSales() throws Exception {
        // Get the sales
        restSalesMockMvc.perform(get("/api/sales/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSales() throws Exception {
        // Initialize the database
        salesService.save(sales);

        int databaseSizeBeforeUpdate = salesRepository.findAll().size();

        // Update the sales
        Sales updatedSales = salesRepository.findById(sales.getId()).get();
        // Disconnect from session so that the updates on updatedSales are not directly saved in db
        em.detach(updatedSales);
        updatedSales
            .state(UPDATED_STATE)
            .date(UPDATED_DATE);

        restSalesMockMvc.perform(put("/api/sales")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSales)))
            .andExpect(status().isOk());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testSales.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesMockMvc.perform(put("/api/sales")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSales() throws Exception {
        // Initialize the database
        salesService.save(sales);

        int databaseSizeBeforeDelete = salesRepository.findAll().size();

        // Delete the sales
        restSalesMockMvc.perform(delete("/api/sales/{id}", sales.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
