package merliontechs.service;

import merliontechs.domain.Sales;
import merliontechs.repository.SalesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Sales}.
 */
@Service
@Transactional
public class SalesService {

    private final Logger log = LoggerFactory.getLogger(SalesService.class);

    private final SalesRepository salesRepository;

    public SalesService(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    /**
     * Save a sales.
     *
     * @param sales the entity to save.
     * @return the persisted entity.
     */
    public Sales save(Sales sales) {
        log.debug("Request to save Sales : {}", sales);
        return salesRepository.save(sales);
    }

    /**
     * Get all the sales.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Sales> findAll() {
        log.debug("Request to get all Sales");
        return salesRepository.findAll();
    }


    /**
     * Get one sales by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Sales> findOne(Long id) {
        log.debug("Request to get Sales : {}", id);
        return salesRepository.findById(id);
    }

    /**
     * Delete the sales by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Sales : {}", id);
        salesRepository.deleteById(id);
    }
}
