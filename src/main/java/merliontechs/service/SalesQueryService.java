package merliontechs.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import merliontechs.domain.Sales;
import merliontechs.domain.*; // for static metamodels
import merliontechs.repository.SalesRepository;
import merliontechs.service.dto.SalesCriteria;

/**
 * Service for executing complex queries for {@link Sales} entities in the database.
 * The main input is a {@link SalesCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Sales} or a {@link Page} of {@link Sales} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class SalesQueryService extends QueryService<Sales> {

    private final Logger log = LoggerFactory.getLogger(SalesQueryService.class);

    private final SalesRepository salesRepository;

    public SalesQueryService(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    /**
     * Return a {@link List} of {@link Sales} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Sales> findByCriteria(SalesCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Sales> specification = createSpecification(criteria);
        return salesRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Sales} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Sales> findByCriteria(SalesCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Sales> specification = createSpecification(criteria);
        return salesRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(SalesCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Sales> specification = createSpecification(criteria);
        return salesRepository.count(specification);
    }

    /**
     * Function to convert {@link SalesCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Sales> createSpecification(SalesCriteria criteria) {
        Specification<Sales> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Sales_.id));
            }
            if (criteria.getState() != null) {
                specification = specification.and(buildSpecification(criteria.getState(), Sales_.state));
            }
            if (criteria.getDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDate(), Sales_.date));
            }
            if (criteria.getProductId() != null) {
                specification = specification.and(buildSpecification(criteria.getProductId(),
                    root -> root.join(Sales_.product, JoinType.LEFT).get(Product_.id)));
            }
        }
        return specification;
    }
}
