package merliontechs.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import merliontechs.domain.enumeration.State;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.LocalDateFilter;

/**
 * Criteria class for the {@link merliontechs.domain.Sales} entity. This class is used
 * in {@link merliontechs.web.rest.SalesResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /sales?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class SalesCriteria implements Serializable, Criteria {
    /**
     * Class for filtering State
     */
    public static class StateFilter extends Filter<State> {

        public StateFilter() {
        }

        public StateFilter(StateFilter filter) {
            super(filter);
        }

        @Override
        public StateFilter copy() {
            return new StateFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StateFilter state;

    private LocalDateFilter date;

    private LongFilter productId;

    public SalesCriteria() {
    }

    public SalesCriteria(SalesCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.state = other.state == null ? null : other.state.copy();
        this.date = other.date == null ? null : other.date.copy();
        this.productId = other.productId == null ? null : other.productId.copy();
    }

    @Override
    public SalesCriteria copy() {
        return new SalesCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StateFilter getState() {
        return state;
    }

    public void setState(StateFilter state) {
        this.state = state;
    }

    public LocalDateFilter getDate() {
        return date;
    }

    public void setDate(LocalDateFilter date) {
        this.date = date;
    }

    public LongFilter getProductId() {
        return productId;
    }

    public void setProductId(LongFilter productId) {
        this.productId = productId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final SalesCriteria that = (SalesCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(state, that.state) &&
            Objects.equals(date, that.date) &&
            Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        state,
        date,
        productId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalesCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (state != null ? "state=" + state + ", " : "") +
                (date != null ? "date=" + date + ", " : "") +
                (productId != null ? "productId=" + productId + ", " : "") +
            "}";
    }

}
